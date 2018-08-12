import Message from 'iview/src/components/message';

export default function throwError(err) {
  console.log(err);
  Message.error({
    content: `<pre>${JSON.stringify(err, 0, 4)}</pre>`,
    closable: true,
    duration: 5
  });
  throw err;
}
