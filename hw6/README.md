### Prerequisites

- Python >= 3.7
- [Tiingo](https://api.tiingo.com/) API Token
- [NewsAPI](https://newsapi.org/) API Key

### Development

- Setup Python using `conda` or `venv`.
- Install dependencies using `pip install`.
- Update Tiingo API Token and NewsAPI API Key in `modules/secrets.py`.
- Run application using `FLASK_APP=application.py flask run` or `python application.py`.

### Deployment

#### AWS

- ELB looks for `application.py` file with `application` Flask object. Could not find a way to override this.
- Build zip using `zip eb-deploy application.py requirements.txt static/* modules/*.py`.
- Verify zip using `unzip -vl eb-deploy.zip`.
- Upload it via ELB console.

#### Azure

- By default, Azure looks at `app.py` or `application.py` file with `app` Flask object.
- Create application using `az webapp up --sku F1 --name usc-csci-571-hw6-<unique> --location westus` which saves information in `.azure/config`.
- Override defaults using `az webapp config set --resource-group <resource_group_created> --name usc-csci-571-hw6-<unique> --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 application:application"`.
- Refresh deployment to use updated configuration using `az webapp up`.

#### Google Cloud

- By default, Google Cloud looks at `main.py` file with `app` Flask object.
- `app.yaml` overrides these defaults using `gunicorn`. That is why `gunicorn` is installed as a dependency.
- Create project using `gcloud projects create usc-csci-571-hw6-<unique> --set-as-default` in `us-west-2` region.
- Create app in above project using `gcloud app create --project=usc-csci-571-hw6-<unique>`.
- Deploy app using `gcloud app deploy`.
