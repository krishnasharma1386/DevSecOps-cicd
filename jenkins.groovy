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
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=devsecops \
                    -Dsonar.projectKey=devsecops '''
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
        stage('Deploy to k8s'){
            steps{
                 withKubeConfig(caCertificate: '', clusterName: '', contextName: '', credentialsId: 'k8s', namespace: '', restrictKubeConfigAccess: false, serverUrl: '') {
                        sh "envsubst < deployment.yaml > deployment-filled.yaml"
                        sh "cat deployment-filled.yaml"
                        sh "sudo kubectl --server=http://localhost:8001 apply -f deployment-filled.yaml"
                        sh "sudo kubectl --server=http://localhost:8001 delete service devsecops-service"
                        sh "sudo kubectl --server=http://localhost:8001 expose deployment devsecops --type=NodePort --name=devsecops-service --port=3000"
                        sh 'sudo kubectl --server=http://localhost:8001 rollout status deployment/devsecops'
                  }
            }
        }
    }
}