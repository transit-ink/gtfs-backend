import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, MapIcon, ClockIcon, CalendarIcon, TruckIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  // { name: 'Agencies', href: '/agencies', icon: TruckIcon },
  { name: 'Routes', href: '/routes', icon: MapIcon },
  { name: 'Trips', href: '/trips', icon: TruckIcon },
  { name: 'Stops', href: '/stops', icon: MapIcon },
  { name: 'Stop Times', href: '/stop-times', icon: ClockIcon },
  // { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  // { name: 'Calendar Dates', href: '/calendar-dates', icon: CalendarIcon },
  // { name: 'Shapes', href: '/shapes', icon: MapIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-semibold">GTFS Editor</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map(item => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                        ${
                          location.pathname === item.href
                            ? 'bg-gray-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-6 w-6 shrink-0 ${
                          location.pathname === item.href
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
