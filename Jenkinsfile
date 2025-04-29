pipeline {
    agent any

    environment {
        SONAR_URL = 'http://10.0.2.15:9000'
    }

    stages {
        stage('Checkout GIT') {
            steps {
                echo 'Pulling...'
                git(
                    branch: 'devops',
                    url: 'https://github.com/kenza-20/TheMenuFy.git',
                    credentialsId: 'gitToken'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install --force'
            }
        }

        stage('Unit Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis via Docker') {
            steps {
                echo 'Running SonarQube analysis with Docker...'
                withCredentials([string(credentialsId: 'credentialsId', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        docker run --rm \
                          -e SONAR_HOST_URL=$SONAR_URL \
                          -e SONAR_LOGIN=$SONAR_TOKEN \
                          -v "$(pwd):/usr/src" \
                          sonarsource/sonar-scanner-cli
                    '''
                }
            }
        }
    }
}
