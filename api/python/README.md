## Info

Look at https://dojocube.com/2023/unleashing-the-power-of-llama-server-in-docker-container/ to get started

## Requirements for hosting

- Need to host Wizard-7B-uncensored.ggmlv3.q5_0.bin (4.6 GB) to be used in the docker build process
- Need to host any other models (<10GB) so that we can dockerize the llama-service and run the service
- Render currently has persistent storage available for 0.25$ per GB 
- Linode requires CC on file to start an account, 
- GCP - 1 e2-micro instance per month for free, 5 GB standard storage for free 
- Professor may or may not want to pay a large sum - in case dev accidentally allows DDoS or other service misuse
- See if Hugging face Spaces can be utilized to store the models and/or run the API directly from huggingface spaces. 