import { Alert } from './alert';

export class AlertManager {
    private alerts: Alert[] = [];

    getAlerts(): Alert[] {
        return this.alerts;
    }

    areAlertsAvailable(): boolean {
        return this.alerts.length > 0;
    }

    addSuccessAlert(message: string): void {
        this.addAlert('success', message);
    }

    addDangerAlert(message: string): void {
        this.addAlert('danger', message);
    }

    private addAlert(type: string, message: string): void {
        this.alerts.unshift({
            type, message
        });
    }

    removeAlert(alertToRemove: Alert): void {
        this.alerts = this.alerts.filter(alert => alert !== alertToRemove);
    }
}
