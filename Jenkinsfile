pipeline {
    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/yourname/mern-notes-app.git'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose -f $WORKSPACE/docker-compose.yml build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose -f $WORKSPACE/docker-compose.yml down
                    docker compose -f $WORKSPACE/docker-compose.yml up -d
                '''
            }
        }
    }

    post {
        success { echo '✅ App live on VM!' }
        failure { echo '❌ Build failed!' }
    }
}