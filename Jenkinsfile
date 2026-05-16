pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'raheeljamal'
    }

    stages {

        stage('Build Images') {
            steps {
                sh '''
                    cd $WORKSPACE
                    docker compose build
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                        echo $PASS | docker login -u $USER --password-stdin
                        docker tag mern-notes-app-server $DOCKERHUB_USER/mern-server:latest
                        docker tag mern-notes-app-client $DOCKERHUB_USER/mern-client:latest
                        docker push $DOCKERHUB_USER/mern-server:latest
                        docker push $DOCKERHUB_USER/mern-client:latest
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    cd $WORKSPACE
                    docker compose down --remove-orphans || true
                    docker stop frontend backend mongodb 2>/dev/null || true
                    docker rm frontend backend mongodb 2>/dev/null || true
                    docker compose up -d
                '''
            }
        }

    }

    post {
        success { echo '✅ Built, pushed and deployed!' }
        failure { echo '❌ Build failed!' }
    }
}