### Development

- Setup Node >= 12 directly or using `nvm`.
- Install dependencies using `npm install`.
- Start application using `npm run start:app`.
- Clean generated files using `npm run clean:app`.

### Deployment

#### AWS

- Build `eb-deploy.zip` deployable using `npm run build:deploy`. Deploy it by uploading manually.
- Clean generated files using `npm run clean:deploy`.

### Azure

- Not supported due to unknown issues.

### Google Cloud

- Not supported because Google Cloud does not allow writing on file system.
