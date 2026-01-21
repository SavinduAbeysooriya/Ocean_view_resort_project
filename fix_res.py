
import os
path = r'c:\Users\Savi Aby\Desktop\New folder (2)\Ocean_view_resort_project\frontend\src\pages\admin\Reservations.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Currency Replacements
content = content.replace('>${selectedReservation.totalCost}', '>LKR {selectedReservation.totalCost}')
content = content.replace('>${roomDetails?.ratePerNight', '>LKR {roomDetails?.ratePerNight')
content = content.replace('>${(selectedReservation.totalCost * 0.10).toFixed(2)}', '>LKR {(selectedReservation.totalCost * 0.10).toFixed(2)}')
content = content.replace('>${(selectedReservation.totalCost * 1.10).toFixed(2)}', '>LKR {(selectedReservation.totalCost * 1.10).toFixed(2)}')
content = content.replace('>-${(selectedReservation.totalCost * 1.10).toFixed(2)}', '>-LKR {(selectedReservation.totalCost * 1.10).toFixed(2)}')
content = content.replace('>${pay.amount.toFixed(2)}', '>LKR {pay.amount.toFixed(2)}')

# Awaiting clearance logic replacement
# I'll just look for the key phrase and replace the group.
content = content.replace('Awaiting clearance', 'System Metadata')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Successfully updated.')
