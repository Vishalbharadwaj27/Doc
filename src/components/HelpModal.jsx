import React from 'react';

/**
 * HelpModal Component
 * Comprehensive help guide with features, shortcuts, and usage instructions
 */
const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: '📖 How to Use the System',
      content: [
        'Welcome to Medora! This is a comprehensive patient management system.',
        '1. Navigate using the left sidebar',
        '2. Use the search bar (Ctrl+K) to quickly find patients',
        '3. Click on any patient card to view detailed information',
        '4. Use the floating action buttons for quick actions',
        '5. Toggle dark mode using the moon/sun icon in the top bar'
      ]
    },
    {
      title: '🔍 How to Search for Patients',
      content: [
        '1. Press Ctrl+K or click the search bar at the top',
        '2. Type the patient\'s name, email, or ID',
        '3. Results will appear in real-time',
        '4. Click on a result to view patient details',
        '5. Use filters on the Patients page for advanced search'
      ]
    },
    {
      title: '➕ How to Add/Edit/Update/Remove Patient Details',
      content: [
        'ADD PATIENT:',
        '  • Click "Add Patient" button on the Patients page',
        '  • Or press "N" key on the Patients page',
        '  • Fill in the form (Name, Age, Gender, Phone, Conditions, Notes)',
        '  • Click "Create" to save',
        '',
        'EDIT PATIENT:',
        '  • Go to patient detail page',
        '  • Click "Edit" button',
        '  • Modify the information',
        '  • Click "Save" to update',
        '',
        'VIEW PATIENT DETAILS:',
        '  • Click on any patient card',
        '  • View full profile, history, and notes',
        '',
        'DELETE PATIENT:',
        '  • Go to patient detail page',
        '  • Click "Delete" button',
        '  • Confirm the action'
      ]
    },
    {
      title: '⌨️ Quick Keyboard Shortcuts',
      content: [
        'Ctrl+K (Cmd+K on Mac) - Open search',
        'N - New patient (on Patients page)',
        '? - Toggle this help menu',
        'M - Toggle sidebar on mobile',
        'D - Toggle dark mode'
      ]
    },
    {
      title: '🎤 Voice Quick Add',
      content: [
        'Click the microphone icon in bottom-right',
        'Speak clearly for 5-30 seconds',
        'Your voice will be converted to text',
        'Create a quick note or reminder'
      ]
    },
    {
      title: '📌 Pinned Patients',
      content: [
        'Click the pin icon on any patient card',
        'Pinned patients appear at top of the list',
        'Also saved to sidebar for quick access',
        'Click again to unpin'
      ]
    },
    {
      title: '📅 Appointments',
      content: [
        'Schedule appointments from the Appointments page',
        'Set date, time, patient, and reason',
        'Automatic conflict detection',
        'Calendar view available',
        'Receive upcoming appointment alerts'
      ]
    },
    {
      title: '📝 Notes & Documentation',
      content: [
        'Create global notes or patient-specific notes',
        'Organize with tags and domains',
        'Rich text formatting available',
        'Search and filter notes',
        'Export notes to PDF'
      ]
    },
    {
      title: '🔧 Settings',
      content: [
        'Enable/disable notifications',
        'Manage backup and restore',
        'Export all patient data',
        'Configure integrations',
        'Manage privacy settings'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 border-b border-blue-400">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">❓</span>
              Help & Documentation
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-400 rounded-lg transition-colors"
              aria-label="Close help"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.content.map((line, lineIdx) => (
                  <li
                    key={lineIdx}
                    className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed"
                    style={{
                      marginLeft: line.startsWith('  •') ? '1.5rem' : 0,
                      fontWeight: line.includes(':') && !line.startsWith('  •') ? '600' : 'normal'
                    }}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            Got it!
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
