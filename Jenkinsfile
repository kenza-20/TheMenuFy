pipeline {
    agent any

    environment {
        SONAR_URL = 'http://10.0.2.15:9000'
    }

    stages {
        stage('Checkout GIT') {
            steps {
                echo 'Pulling the code...'
                script {
                    def branchName = env.GIT_BRANCH
                    if (branchName == 'devopsFont') {
                        git(
                            branch: 'devopsFont',
                            url: 'https://github.com/kenza-20/TheMenuFy.git',
                            credentialsId: 'gitToken'
                        )
                    } else if (branchName == 'devops') {
                        git(
                            branch: 'devops',
                            url: 'https://github.com/kenza-20/TheMenuFy.git',
                            credentialsId: 'gitToken'
                        )
                    }
                }
            }
        }

        stage('Diagnostic') {
            steps {
                script {
                    echo "GIT_BRANCH: ${env.GIT_BRANCH}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install --force'
            }
        }

        stage('SonarQube Analysis Front') {
            when {
                expression { env.GIT_BRANCH?.trim() == 'devopsFont' }
            }
            steps {
                echo 'Running SonarQube analysis for Frontend...'
                withCredentials([string(credentialsId: 'sonarr', variable: 'SONAR_TOKEN')]) {
                    sh """
                        docker run --rm \
                          -e SONAR_HOST_URL=$SONAR_URL \
                          -e SONAR_LOGIN=$SONAR_TOKEN \
                          -e SONAR_PROJECT_KEY=menufy-projetFront \
                          -v \$(pwd):/usr/src \
                          sonarsource/sonar-scanner-cli
                    """
                }
            }
        }

        stage('SonarQube Analysis Back') {
            when {
                expression { env.GIT_BRANCH?.trim() == 'devops' }
            }
            steps {
                echo 'Running SonarQube analysis for Backend...'
                withCredentials([string(credentialsId: 'sonarr', variable: 'SONAR_TOKEN')]) {
                    sh """
                        docker run --rm \
                          -e SONAR_HOST_URL=$SONAR_URL \
                          -e SONAR_LOGIN=$SONAR_TOKEN \
                          -e SONAR_PROJECT_KEY=menufy-projetBack \
                          -v \$(pwd):/usr/src \
                          sonarsource/sonar-scanner-cli
                    """
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    def imageName = "kenza590/menufy-projet"
                    def imageTag = "latest"

                    withCredentials([usernamePassword(credentialsId: 'dockerHubCreds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker build -t ${imageName}:${imageTag} . 
                            docker push ${imageName}:${imageTag}
                            docker logout
                        """
                    }
                }
            }
        }

        stage('Build & Push Front Docker Image') {
            when {
                expression { env.GIT_BRANCH?.trim() == 'devopsFont' }
            }
            steps {
                script {
                    def imageName = "kenza590/menufy-front"
                    def imageTag = "latest"

                    withCredentials([usernamePassword(credentialsId: 'dockerHubCreds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker build -t ${imageName}:${imageTag} . 
                            docker push ${imageName}:${imageTag}
                            docker logout
                        """
                    }
                }
            }
        }
    }
}
