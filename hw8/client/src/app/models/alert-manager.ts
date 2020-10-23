import { Alert } from './alert';

export class AlertManager {
    private alerts: Alert[] = [];

    getAlerts(): Alert[] {
        return this.alerts;
    }

    areAlertsAvailable(): boolean {
        return this.alerts.length > 0;
    }

    addSuccessAlert(message: string, dismissible = true): void {
        this.addAlert('success', message, dismissible);
    }

    addWarningAlert(message: string, dismissible = true): void {
        this.addAlert('warning', message, dismissible);
    }

    addDangerAlert(message: string, dismissible = true): void {
        this.addAlert('danger', message, dismissible);
    }

    private addAlert(type: string, message: string, dismissible: boolean): void {
        this.alerts.unshift({
            type, message, dismissible
        });
    }

    removeAlert(alertToRemove: Alert): void {
        this.alerts = this.alerts.filter(alert => alert !== alertToRemove);
    }

    clear(): void {
        this.alerts = [];
    }
}
