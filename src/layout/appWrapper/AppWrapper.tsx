'use client';
import { useUser } from '@/state/auth';
import { useSocketStore } from '@/state/socket';
import useApiHook from '@/state/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import React, { useEffect } from 'react';
import io from 'socket.io-client';
// import { Router } from "next/router";
// import NProgress from "nprogress"; //nprogress module

type Props = {
  children: React.ReactNode;
};
const AppWrapper = (props: Props) => {
  const queryClient = useQueryClient();
  //Set up state
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string;
  const { data: loggedInData, isLoading: userIsLoading } = useUser();
  const { data: profile } = useApiHook({
    method: 'GET',
    key: ['profile', 'admin'],
    url: `/profile/admin`,
    filter: `user;${loggedInData?._id}`,
  });
  const selectedProfile = profile?.payload[0];
  //Set up socket connection
  const { socket, isConnecting, setSocket, setIsConnecting } = useSocketStore((state) => state);

  useEffect(() => {
    if (process.env.API_URL) {
      setIsConnecting(true);
      const socket = io(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000'
          : process.env.API_URL.replace('/api/v1', '')
      );
      socket.on('connect', () => {
        setIsConnecting(false);
        setSocket(socket);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    //If there is a user and a socket connection, setup a setup event with the user data

    if (socket && isConnecting) {
      // Listen for user updates
      socket.emit('setup', loggedInData);
      socket.on('updateUser', () => {
        queryClient.invalidateQueries(['user'] as any);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!selectedProfile) return;
    // if selectedProfile is null or role is not admin, dispatch the token, logout and redirect
    // alert user that they are not authorized to access the admin portal
    if (
      !selectedProfile?.roles?.some((value: any) => ['admin', 'developer'].includes(value))
    ) {
      alert('You are not authorized to access this portal.');
    }
  }, [selectedProfile]);
  return <>{props.children}</>;
};

export default AppWrapper;
