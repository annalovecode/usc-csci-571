### Prerequisites

- Node >= 12

### Development

- Install dependencies using `npm install`.
- Start application using `npm run start:app`.
- Clean generated files using `npm run clean:app`.

### Deployment

#### AWS

- Install dependencies using `npm install`.
- Set `start` npm script to `npm run start:aws`.
- Build `eb-deploy.zip` deployable using `npm run build:aws`. Deploy it by uploading manually.
- Clean generated files using `npm run clean:aws`.

#### Azure

- Install dependencies using `npm install`.
- Set `start` npm script to `npm run start:az`.
- Build assets using `npm run build:az`.
- Run `rm -rf node_modules`.
- Create and deploy application using `az webapp up --sku F1 --name usc-csci-571-hw8-<unique> --location westus`. It saves information in `.azure/config`.
- Clean generated files using `npm run clean:az`.

#### Google Cloud

- Install dependencies using `npm install`.
- Set `start` npm script to `npm run start:gc`.
- Build assets using `npm run build:gc`.
- Create project using `gcloud projects create usc-csci-571-hw8-<unique> --set-as-default` in `us-west-2` region.
- Create app in above project using `gcloud app create --project=usc-csci-571-hw8-<unique>`.
- Deploy app using `gcloud app deploy`.
- Clean generated files using `npm run clean:gc`.
