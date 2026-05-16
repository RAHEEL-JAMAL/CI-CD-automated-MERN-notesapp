pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'raheeljamal'
    }

    stages {

        stage('Build Images') {
            steps {
                sh 'docker compose -f $WORKSPACE/docker-compose.yml build'
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
                        docker tag mern-app-server $DOCKERHUB_USER/mern-server:latest
                        docker tag mern-app-client $DOCKERHUB_USER/mern-client:latest
                        docker push $DOCKERHUB_USER/mern-server:latest
                        docker push $DOCKERHUB_USER/mern-client:latest
                    '''
                }
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
        success { echo '✅ Built, pushed and deployed!' }
        failure { echo '❌ Build failed!' }
    }
}