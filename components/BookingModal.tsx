import React from 'react';
import { X, Calendar, Mail, ExternalLink } from 'lucide-react';
import { CONTACT_INFO, SITE_CONFIG } from '../constants';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const CALENDAR_URL = CONTACT_INFO.calendar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-[85vh] bg-secondary rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Calendar className="text-accent" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Schedule a Meeting</h3>
              <p className="text-xs text-slate-400">Book a time directly on {SITE_CONFIG.userName}'s Google Calendar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white relative w-full h-full">
          {CALENDAR_URL ? (
            <iframe
              src={CALENDAR_URL}
              className="w-full h-full border-0"
              title="Schedule Appointment"
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-900">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <Calendar className="text-slate-400" size={32} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Calendar Integration Ready</h4>
              <p className="text-slate-400 max-w-md mb-8">
                To enable live booking, please generate your <strong>Google Calendar Appointment Schedule</strong> link and paste it into the <code>calendar</code> field in <code>src/data/profile.json</code>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://calendar.google.com/calendar/u/0/r/appointment"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 bg-accent text-slate-900 font-semibold rounded-lg hover:bg-accentHover transition-colors flex items-center justify-center gap-2"
                >
                  Get Calendar Link <ExternalLink size={16} />
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="px-6 py-2.5 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  Send Email Instead <Mail size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;