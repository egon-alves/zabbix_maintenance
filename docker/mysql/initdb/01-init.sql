CREATE USER 'maintenance_web'@'%' IDENTIFIED BY 'maintenancepassword';
GRANT ALL PRIVILEGES ON maintenance.* TO 'maintenance_web'@'%';
FLUSH PRIVILEGES;