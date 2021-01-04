import React, {FC, useEffect} from 'react';
import {useRouter} from 'next/router';

import {adminOnly} from '../../hocs/adminOnly';

const AdminDashboardPage: FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('admin/analytics/new-users/');
  }, []);
  return (
    <div id="admin-dashboard-page">
      <h1>Redirecting ...</h1>
    </div>
  );
};

export default adminOnly(AdminDashboardPage);
