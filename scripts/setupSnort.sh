#!/bin/bash

# Update package lists
sudo apt-get update

# Install SNORT
sudo apt-get install -y snort

# Verify SNORT installation
snort -V

# Copy the SNORT configuration file to the appropriate directory
sudo cp /mnt/c/Snort/snort.conf /etc/snort/snort.conf

# Create necessary directories
sudo mkdir -p /etc/snort/rules
sudo mkdir -p /var/log/snort

# Set permissions
sudo chown -R snort:snort /etc/snort
sudo chown -R snort:snort /var/log/snort

# Start SNORT in IDS mode
sudo snort -c /etc/snort/snort.conf -i eth0

echo "SNORT setup completed successfully."