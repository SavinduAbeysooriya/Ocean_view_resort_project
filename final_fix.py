
import os
path = r'c:\Users\Savi Aby\Desktop\New folder (2)\Ocean_view_resort_project\frontend\src\pages\admin\Reservations.jsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_block = """                                                <div className="p-3 bg-luxury-cream/10 dark:bg-white/5 rounded-sm border border-black/5 dark:border-white/5">
                                                     <div className="flex items-center space-x-2 text-luxury-gold mb-2">
                                                         <Info size={12}/>
                                                         <h4 className="text-[8px] font-bold uppercase tracking-widest">System Intelligence</h4>
                                                     </div>
                                                     <div className="space-y-1.5 text-[10px]">
                                                         <div className="flex justify-between">
                                                             <span className="opacity-40 uppercase text-[8px]">Created At</span>
                                                             <span className="text-luxury-charcoal dark:text-white font-mono">{moment(selectedReservation.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                                                         </div>
                                                         <div className="flex justify-between">
                                                             <span className="opacity-40 uppercase text-[8px]">Last Update</span>
                                                             <span className="text-luxury-charcoal dark:text-white font-mono">{moment(selectedReservation.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
                                                         </div>
                                                         <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/5">
                                                             <p className="text-[8px] uppercase tracking-tighter opacity-40 mb-1">Dossier Notes</p>
                                                             <p className="text-luxury-charcoal/80 dark:text-white/80 italic leading-relaxed text-[10px]">{selectedReservation.notes || "Standard Booking - No specific preferences noted."}</p>
                                                         </div>
                                                     </div>
                                                 </div>
"""

# Find the indices of the lines to replace
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'System Metadata' in line:
        # Search backwards for the start div
        for j in range(i, 0, -1):
            if '<div className="py-6' in lines[j]:
                start_idx = j
                break
        # Search forwards for the end div
        for j in range(i, len(lines)):
            if '</div>' in lines[j]:
                end_idx = j
                break
        break

if start_idx != -1 and end_idx != -1:
    lines[start_idx:end_idx+1] = [new_block]
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('Successfully replaced block.')
else:
    print('Could not find placeholder block.')
