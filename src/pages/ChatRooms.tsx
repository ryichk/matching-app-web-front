import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';

import { getChatRooms } from 'lib/api/chat-rooms';
import { ChatRoom, Severity } from 'types';
import AlertMessage from 'components/utils/AlertMessage';

import commonStyles from 'components/styles/common';

const ChatRooms: React.FC = () => {
  const styles = commonStyles();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  const handleGetChatRooms = async () => {
    try {
      const response = await getChatRooms();
      if (response.status === 200) {
        setChatRooms(response.data.chatRooms);
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage(String(error));
      setSeverity('error');
    }
  };

  useEffect(() => {
    handleGetChatRooms();
  }, []);

  return (
    <>
      {chatRooms.length > 0 ? (
        chatRooms.map((chatRoom: ChatRoom, index: number) => {
          return (
            <Grid container key={String(index)} justify="center">
              <List>
                <Link to={`/chat-room/${chatRoom.chatRoom.id}`} className={styles.chatRoomLink}>
                  <div className={styles.root}>
                    <ListItem alignItems="flex-start" style={{ padding: 0 }}>
                      <ListItemAvatar>
                        <Avatar alt="avatar" src={chatRoom.otherUser.image.url} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={chatRoom.otherUser.nickname}
                        secondary={
                          <div style={{ marginTop: '0.5rem' }}>
                            <Typography component="span" variant="body2" color="textSecondary">
                              {chatRoom.lastMessage?.content.length > 30
                                ? `${chatRoom.lastMessage?.content.substr(0, 30)}...`
                                : chatRoom.lastMessage?.content}
                            </Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  </div>
                </Link>
                <Divider component="li" />
              </List>
            </Grid>
          );
        })
      ) : (
        <Typography component="p" variant="body2" color="textSecondary">
          No Matched users
        </Typography>
      )}
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity={severity}
        message={alertMessage}
      />
    </>
  );
};

export default ChatRooms;
