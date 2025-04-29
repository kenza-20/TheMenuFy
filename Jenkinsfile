pipeline {
    agent any

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
        
stage('SonarQube Analysis') {
    steps {
        echo 'Running SonarQube analysis...'
        withCredentials([string(credentialsId: 'sonarToken', variable: 'SONAR_TOKEN')]) {
            sh '''
                sonar-scanner \
                    -Dsonar.projectKey=TheMenuFy \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://localhost:9000 \
                    -Dsonar.login=$SONAR_TOKEN \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
            '''
        }
    }
}


    }
}
