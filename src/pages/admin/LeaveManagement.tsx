import { Outlet } from 'react-router-dom';
import { useLayout } from '../../context/LayoutContext';

export default function LeaveManagement() {
  const { layout } = useLayout();
  return (
    <div>
      <Outlet />
    </div>
  );
}
