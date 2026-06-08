1. Navigate to **Account Settings** → **Connections** and select **Create new connection**.
2. Select <strong>{props.platform}</strong>.
3. You will see two radio buttons: <strong>{props.publicLabel || 'Public'}</strong> and <strong>{props.privateLabel || 'Private'}</strong>. Select <strong>{props.privateLabel || 'Private'}</strong>.
4. Select the private endpoint from the dropdown{props.endpointNote || ''} (this automatically populates the {props.field || 'hostname/account field'}).
5. {props.remainingDetails || 'Configure the remaining data platform details.'}
6. {props.testLine || 'Test your connection and save it.'}
7. To use this connection, navigate to **Account Settings** → **Projects**, select your project, and choose the PrivateLink connection you created at the **Configure your development environment** step.
