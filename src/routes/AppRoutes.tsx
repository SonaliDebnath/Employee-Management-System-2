import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/layout/AppLayout';

// Auth pages
import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';

// Dashboard
import AdminDashboard from '../pages/admin/Dashboard';

// Employee Management
import EmployeeManagement from '../pages/admin/EmployeeManagement';
import EmployeesTab from '../pages/admin/tabs/EmployeesTab';
import UserOperationsTab from '../pages/admin/tabs/UserOperationsTab';
import InsightsTab from '../pages/admin/tabs/InsightsTab';
import DepartmentsTab from '../pages/admin/tabs/DepartmentsTab';
import DesignationsTab from '../pages/admin/tabs/DesignationsTab';

// Detail pages
import EmployeeDetail from '../pages/admin/EmployeeDetail';
import DepartmentDetail from '../pages/admin/DepartmentDetail';
import SubDepartmentDetail from '../pages/admin/SubDepartmentDetail';
import UserProfile from '../pages/admin/UserProfile';

// Attendance
import AdminAttendance from '../pages/admin/Attendance';

// Leave Management
import LeaveManagement from '../pages/admin/LeaveManagement';
import ApplyLeaveTab from '../pages/admin/tabs/ApplyLeaveTab';
import ApprovalsTab from '../pages/admin/tabs/ApprovalsTab';
import LeaveHistoryTab from '../pages/admin/tabs/LeaveHistoryTab';
import LeaveBalanceTab from '../pages/admin/tabs/LeaveBalanceTab';
import LeavePoliciesTab from '../pages/admin/tabs/LeavePoliciesTab';
import HolidayCalendarTab from '../pages/admin/tabs/HolidayCalendarTab';
import LeaveReportsTab from '../pages/admin/tabs/LeaveReportsTab';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<GuestOnly><SignIn /></GuestOnly>} />
      <Route path="/signup" element={<GuestOnly><SignUp /></GuestOnly>} />

      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/" element={<AdminDashboard />} />

        <Route path="/employee-management" element={<EmployeeManagement />}>
          <Route index element={<EmployeesTab />} />
          <Route path="user-operations" element={<UserOperationsTab />} />
          <Route path="insights" element={<InsightsTab />} />
          <Route path="departments" element={<DepartmentsTab />} />
          <Route path="designations" element={<DesignationsTab />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="departments/:deptId" element={<DepartmentDetail />} />
          <Route path="departments/:deptId/:subDeptId" element={<SubDepartmentDetail />} />
          <Route path="user-operations/:id" element={<UserProfile />} />
        </Route>

        <Route path="/attendance" element={<AdminAttendance />} />

        <Route path="/leave-management" element={<LeaveManagement />}>
          <Route index element={<ApplyLeaveTab />} />
          <Route path="approvals" element={<ApprovalsTab />} />
          <Route path="history" element={<LeaveHistoryTab />} />
          <Route path="balance" element={<LeaveBalanceTab />} />
          <Route path="policies" element={<LeavePoliciesTab />} />
          <Route path="holidays" element={<HolidayCalendarTab />} />
          <Route path="reports" element={<LeaveReportsTab />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
