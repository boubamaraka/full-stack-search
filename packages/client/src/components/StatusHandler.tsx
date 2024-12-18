import React from 'react';

type StatusHandlerProps = {
  loading: boolean;
  error: string | null;
  data: Record<string, unknown> | null;
  notFoundMessage: string;
  children: React.ReactNode;
};

const StatusHandler: React.FC<StatusHandlerProps> = ({ loading, error, data, notFoundMessage, children }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>{notFoundMessage}</div>;
  }

  return <>{children}</>;
};

export default StatusHandler;
