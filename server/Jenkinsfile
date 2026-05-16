pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'raheeljamal'
        SERVER_IP      = '192.168.122.127'
        SERVER_USER    = 'raheel'
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/RAHEEL-JAMAL/CI-CD-automated-MERN-notesapp.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/mern-server ./server'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/mern-client ./client'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $DOCKERHUB_USER/mern-server'
                    sh 'docker push $DOCKERHUB_USER/mern-client'
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                sshagent(['ssh-server-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "
                            cd /app/mern-notes-app &&
                            docker-compose pull &&
                            docker-compose up -d
                        "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}