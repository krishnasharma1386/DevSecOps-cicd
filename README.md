Here’s a comprehensive GitHub README file incorporating the details provided for setting up a DevSecOps pipeline with Jenkins, Docker, Minikube, and various security tools. This README includes steps for setting up the environment, installing necessary tools, configuring Jenkins, and running a pipeline. It also references images for clarity.

Ensure you replace the placeholder paths (`images/filename.png`) with actual paths to your images.

---

# DevSecOps Pipeline Setup with Jenkins, Docker, Minikube, and Security Tools

This guide details the setup of a DevSecOps pipeline using Jenkins, Docker, Minikube, and tools like SonarQube, Trivy, and OWASP Dependency Check.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installing Packages](#installing-packages)
- [Setting Up Environment](#setting-up-environment)
- [Create Pipeline Project in Jenkins](#create-pipeline-project-in-jenkins)
- [Install OWASP Dependency Check Plugins](#install-owasp-dependency-check-plugins)
- [Docker Image Build and Push](#docker-image-build-and-push)
- [Deploy the Image using Kubernetes](#deploy-the-image-using-kubernetes)
- [Final Pipeline Code](#final-pipeline-code)
- [Build and Outcome](#build-and-outcome)

## Prerequisites
- Ubuntu machine with Docker and Minikube installed.
- Jenkins installed and running.
- GitHub account and repository.

## Installing Packages

1. **Verify Docker and Minikube Installation**:
    - Check Docker version:
      ```bash
      docker --version
      ```
    - Check Minikube version:
      ```bash
      minikube --version
      ```

2. **Install Trivy and Ngrok**:
    - **Trivy**:
      ```bash
      wget https://github.com/aquasecurity/trivy/releases/download/v0.18.3/trivy_0.18.3_Linux-64bit.deb
      sudo dpkg -i trivy_0.18.3_Linux-64bit.deb
      ```
      ![Install Trivy](images/install-trivy.png)
    - **Ngrok**:
      ```bash
      sudo apt install ngrok
      ```
      ![Install Ngrok](images/install-ngrok.png)

3. **Create SonarQube Container**:
    ```bash
    docker run -d -p 9000:9000 sonarqube
    ```
    Access GUI at [localhost:9000](http://localhost:9000).

    ![Create SonarQube Container](images/create-sonarqube-container.png)

## Setting Up Environment

1. **Start Jenkins and Expose Port**:
    ```bash
    ngrok http 8080
    ```
    ![Expose Jenkins Port](images/expose-jenkins-port.png)

2. **Install Jenkins Plugins**:
    - Eclipse Temurin Installer
    - SonarQube Scanner
    - NodeJS Plugin

    ![Install Jenkins Plugins](images/install-jenkins-plugins.png)

3. **Configure Java and NodeJS in Jenkins**:
    - Go to **Manage Jenkins** → **Global Tool Configuration**.
    - Install JDK 17 and NodeJS 19.
    - Click **Apply and Save**.

    ![Configure Java and NodeJS](images/configure-java-nodejs.png)

## Create Pipeline Project in Jenkins

1. **Create Jenkins Job**:
    - Create a new pipeline job named `Demo`.

    ![Create Jenkins Job](images/create-jenkins-job.png)

2. **Setup SonarQube Server**:
    - Create a token in SonarQube and add it as a global credential in Jenkins.

    ![Setup SonarQube](images/setup-sonarqube.png)

3. **Configure SonarQube in Jenkins**:
    - Go to **Manage Jenkins** → **System Configuration** → **SonarQube Servers**.
    - Add your SonarQube server details and token.

    ![Configure SonarQube in Jenkins](images/configure-sonarqube-jenkins.png)

4. **Create SonarQube Webhook**:
    - In SonarQube, go to **Configuration** → **Webhooks** and add a webhook URL pointing to Jenkins `/sonarqube-webhook/`.

    ![Create SonarQube Webhook](images/create-sonarqube-webhook.png)

5. **Setup GitHub Webhook**:
    - Go to your GitHub repository settings, add a new webhook with the URL pointing to Jenkins `/github-webhook/`.

    ![Setup GitHub Webhook](images/setup-github-webhook.png)

6. **Add Pipeline Code**:
    - Go to the pipeline configuration, and add the provided pipeline code.
    - Check the **GitHub hook trigger for GITScm polling**.

    ```groovy
    pipeline {
        agent any
        tools{
            jdk 'jdk-17'
            nodejs 'nodejs'
        }
        environment {
            SCANNER_HOME = tool 'sonar-scanner'
            IMAGE_TAG = "dhruv203/demo:${BUILD_NUMBER}"
        }
        stages {
            stage('clean workspace'){
                steps{
                    cleanWs()
                }
            }
            stage('Checkout from Git'){
                steps{
                    git 'https://github.com/dhruv-203/DevSecOps.git'
                }
            }
            stage("Sonarqube Analysis "){
                steps{
                    withSonarQubeEnv('sonar-server') {
                        sh '''
                            $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=devsecops \
                            -Dsonar.projectKey=devsecops
                        '''
                    }
                }
            }
            stage("quality gate"){
                steps {
                    script {
                        waitForQualityGate abortPipeline: false, credentialsId: 'sonar_cred'
                    }
                }
            }
            stage('Install Dependencies') {
                steps {
                    sh "npm install"
                }
            }
        }
    }
    ```

    ![Add Pipeline Code](images/add-pipeline-code.png)

## Install OWASP Dependency Check Plugins

1. **Install Plugin**:
    - Go to **Manage Jenkins** → **Manage Plugins** → **Available**.
    - Install OWASP Dependency-Check.

    ![Install OWASP Dependency Check](images/install-owasp-plugin.png)

2. **Configure OWASP Tool**:
    - Go to **Manage Jenkins** → **Global Tool Configuration** → **Dependency-Check**.

    ![Configure OWASP Tool](images/configure-owasp-tool.png)

3. **Update Pipeline Code**:
    - Add stages for OWASP and Trivy scans.

    ```groovy
    stage('OWASP FS SCAN') {
        steps {
            dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
            dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
        }
    }
    stage('TRIVY FS SCAN') {
        steps {
            sh "trivy fs . > trivyfs.txt"
        }
    }
    ```

    ![Update Pipeline Code](images/update-pipeline-code.png)

## Docker Image Build and Push

1. **Install Docker Plugins**:
    - Install Docker, Docker Commons, Docker Pipeline, Docker API, and docker-build-step plugins.

    ![Install Docker Plugins](images/install-docker-plugins.png)

2. **Configure Docker in Jenkins**:
    - Go to **Manage Jenkins** → **Global Tool Configuration**.

    ![Configure Docker](images/configure-docker.png)

3. **Add DockerHub Credentials**:
    - Add your DockerHub credentials in Jenkins under **Manage Jenkins** → **Manage Credentials**.

    ![Add DockerHub Credentials](images/add-dockerhub-credentials.png)

4. **Update Pipeline Code**:
    - Add stages for building and pushing Docker images, and Trivy scan.

    ```groovy
    stage("Docker Build & Push"){
        steps{
            script{
                withDockerRegistry(credentialsId: 'docker', toolName: 'docker'){
                    sh "docker container prune -f"
                    sh "docker build -t ${IMAGE_TAG} ."
                    sh "docker push ${IMAGE_TAG}"
                }
            }
        }
    }
    stage("TRIVY"){
        steps{
            sh "trivy image --timeout 15m --scanners vuln dhruv203/demo:latest > trivy.txt"
        }
    }
    ```

    ![Update Docker Pipeline Code](images/update-docker-pipeline-code.png)

## Deploy the Image using Kubernetes

1. **Add Kubernetes Config as Global Credential**:
    - Go to **Manage Jenkins** → **Manage Credentials**.
    - Upload the Kubernetes config file as a secret file.

    ![Add Kubernetes Config](images/add-kubernetes-config.png)

2. **Update Pipeline Code**:
    - Add stage for deploying to Kubernetes.

    ```groovy
    stage('Deploy to k8s'){
        steps{
            withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'k8s', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                sh "envsubst < deployment.yaml > deployment-filled.yaml"
                sh "cat deployment-filled.yaml"
                sh "sudo kubectl --server=http://localhost:8001 apply -f deployment-filled.yaml"
                sh "sudo kubectl --server=http://localhost:8001 delete service devsecops-service"
                sh "sudo kubectl --server=http://localhost:8001 expose deployment devsecops --type=NodePort --name=devsecops-service
