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

- Not supported due to unknown issues.

#### Google Cloud

- Install dependencies using `npm install`.
- Set `start` npm script to `npm run start:gcloud`.
- Build assets using `npm run build:gcloud`.
- Create project using `gcloud projects create usc-csci-571-hw8-<unique> --set-as-default` in `us-west-2` region.
- Create app in above project using `gcloud app create --project=usc-csci-571-hw8-<unique>`.
- Deploy app using `gcloud app deploy`.
- Clean generated files using `npm run clean:gcloud`.
