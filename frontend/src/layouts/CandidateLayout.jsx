import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function CandidateLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="candidate" />
      <main className="flex-1 min-w-0">
        <Navbar />
        <div className="p-4 lg:p-8 pt-6">
          <div className="max-w-6xl mx-auto">
          <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
