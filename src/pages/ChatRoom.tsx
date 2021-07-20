import React, { useEffect, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Avatar, Box, Button, Grid, TextField, Typography } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

import { AuthContext } from 'App';
import { User, Message, Severity } from 'types';
import { getChatRoom } from 'lib/api/chat-rooms';
import createMessage from 'lib/api/messages';
import AlertMessage from 'components/utils/AlertMessage';
import commonStyles from 'components/styles/common';

type ChatRoomProps = RouteComponentProps<{ id: string }>;

const ChatRoom: React.FC<ChatRoomProps> = (props: ChatRoomProps) => {
  const styles = commonStyles();
  const { currentUser } = useContext(AuthContext);
  const { match } = props;
  const chatRoomId = Number(match.params.id);

  const [loading, setLoading] = useState<boolean>(true);
  const [otherUser, setOtherUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>('');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  const handleGetChatRoom = async () => {
    try {
      const response = await getChatRoom(chatRoomId);
      if (response.status === 200) {
        setOtherUser(response.data.otherUser);
        setMessages(response.data.messages);
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage('Failed to update user.');
      setSeverity('error');
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetChatRoom();
  }, []);

  const handleCreateMessage = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const data: Message = {
      chatRoomId,
      userId: currentUser?.id,
      content,
    };

    try {
      const response = await createMessage(data);
      if (response.status === 200) {
        setMessages([...messages, response.data.message]);
        setContent('');
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage('Failed to update user.');
      setSeverity('error');
    }
  };

  const iso8601ToDateTime = (iso8601: string) => {
    const date = new Date(Date.parse(iso8601));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${year}年${month}月${day}日${hour}時${minute}分`;
  };

  return (
    <>
      {!loading ? (
        <div style={{ maxWidth: 360 }}>
          <Grid container justify="center" style={{ marginBottom: '1rem' }}>
            <Grid item>
              <Avatar alt="avatar" src={otherUser?.image.url || ''} className={styles.avatar} />
              <Typography
                variant="body2"
                component="p"
                gutterBottom
                style={{ marginTop: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}
              >
                {otherUser?.nickname}
              </Typography>
            </Grid>
          </Grid>
          {messages.map((message: Message, index: number) => {
            return (
              <Grid
                key={String(index)}
                container
                justify={message.userId === otherUser?.id ? 'flex-start' : 'flex-end'}
              >
                <Grid item>
                  <Box
                    borderRadius={
                      message.userId === otherUser?.id ? '30px 30px 30px 0' : '30px 30px 0 30px'
                    }
                    bgcolor={message.userId === otherUser?.id ? '#d3d3de' : '#ffb6c1'}
                    color={message.userId === otherUser?.id ? '#000000' : '#ffffff'}
                    m={1}
                    border={0}
                    style={{ padding: '1rem' }}
                  >
                    <Typography variant="body1" component="p">
                      {message.content}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    component="p"
                    color="textSecondary"
                    style={{ textAlign: message.userId === otherUser?.id ? 'left' : 'right' }}
                  >
                    {iso8601ToDateTime(message.createdAt?.toString() || '100000000')}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
          <Grid container justify="center" style={{ marginTop: '2rem' }}>
            <form className={styles.formWrapper} noValidate autoComplete="off">
              <TextField
                required
                multiline
                value={content}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setContent(event.target.value)
                }
                className={styles.textInputWrapper}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={!content}
                onClick={handleCreateMessage}
                className={styles.messageSubmitBtn}
              >
                <SendIcon />
              </Button>
            </form>
          </Grid>
        </div>
      ) : (
        <></>
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

export default ChatRoom;
