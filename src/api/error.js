import Message from 'iview/src/components/message';

export default function throwError(err) {
  console.log(err);
  Message.error({
    content: `${err.code || ''} ${err.message}`,
    closable: true,
    duration: 30
  });
  throw err;
}
