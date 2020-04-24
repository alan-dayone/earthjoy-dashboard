import React, {FC, ReactNode} from 'react';

export const NoBackgroundCardLayout: FC = ({
  children,
}: {
  children: ReactNode;
}) => (
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card p-4">{children}</div>
      </div>
    </div>
  </div>
);
