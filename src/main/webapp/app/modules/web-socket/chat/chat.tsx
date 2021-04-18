import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Storage} from 'react-jhipster';
import Webcam from 'react-webcam';
import {Observable} from 'rxjs';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import {Base64} from 'js-base64';

let al;


let stompClient = null;

let subscriber = null;
let connection: Promise<any>;
let connectedPromise: any = null;
let listener: Observable<any>;
let listenerObserver: any;
let alreadyConnectedOnce = false;


const Chat = props =>
{

  const createConnection = (): Promise<any> =>
    new Promise((resolve, reject) => (connectedPromise = resolve));

  const createListener = (): Observable<any> =>
    new Observable(observer => listenerObserver = observer);

  const sendActivity = (data, details) =>
    connection?.then(() =>
      stompClient?.send
      (
        '/topic/video-call/activity', // destination
        JSON.stringify({data, details}), // body
        {} // header
      )
    );

  const subscribe = () =>
    connection.then(() =>
      subscriber = stompClient.subscribe
      (
        '/topic/video-call/group/1234x',
        data =>
        {
          const result = JSON.parse(data.body);
          const videoBase64 = result.data.split(",")[2];
          const videoBytes = Base64.decode(videoBase64);
          fetch(result.data.replace(";codecs=avc1,opus", "")).then(res => res.blob())
            // .then(blob => window.console.log(blob.text()))
            .then(blob => process(blob));
        }
      )
    );


  const connect = () =>
  {
    if (connectedPromise !== null || alreadyConnectedOnce)
    {
      // the connection is already being established
      return;
    }
    connection = createConnection();
    listener = createListener();

    // building absolute path so that websocket doesn't fail when deploying with a context path
    const loc = window.location;
    const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

    const headers = {};
    let url = '//' + loc.host + baseHref + '/websocket/video-call';
    const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
    if (authToken)
      url += '?access_token=' + authToken;

    const socket = new SockJS(url);
    stompClient = Stomp.over(socket, {protocols: ['v12.stomp']});

    stompClient.connect(headers, () =>
    {
      connectedPromise('success');
      connectedPromise = null;
      // sendActivity(window.location.pathname);
      alreadyConnectedOnce = true;
    });
  };


  const receive = () => listener;

  const disconnect = () =>
  {
    if (stompClient !== null)
      if (stompClient.connected)
        stompClient.disconnect();
    stompClient = null;
    alreadyConnectedOnce = false;
  };

  const unsubscribe = () =>
  {
    if (subscriber !== null)
      subscriber.unsubscribe();
    listener = createListener();
  };


  const access_token = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  useEffect(() =>
  {
    connect();
    subscribe();
  }, []);

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleStartCaptureClick = useCallback(() =>
  {
    setCapturing(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {mimeType: "video/webm"});
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start(500);
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(({data}) =>
  {
    if (data.size > 0)
    {
      // setRecordedChunks((prev) =>
      // {
      //   window.console.log(prev);
      //   const a = prev.concat(data);
      //   window.console.log(a[0].text());
      //   return a;
      // } );
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onloadend = () => sendActivity(reader.result, "chạy mẹ nó rồi");
      // window.console.log(subscribe());
    }
  }, [setRecordedChunks]);

  const process = useCallback((x) =>
  {
    const data = x.slice(0, x.size, 'video/x-matroska;codecs=avc1,opus')
    if (data.size > 0)
    {
      setRecordedChunks((prev) =>
      {
        window.console.log(prev);
        const a = prev.concat(data);
        window.console.log(a[0].text());
        return a;
      });
    }
  }, [setRecordedChunks]);

  const handleStopCaptureClick = useCallback(() =>
  {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() =>
  {
    if (recordedChunks.length)
    {

      const blob = new Blob(recordedChunks, {type: "video/webm"});
      al = URL.createObjectURL(blob);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);


  return (
    <div>
      <h1>chat</h1>
      <Webcam audio={true} ref={webcamRef}/>
      {capturing ?
        (<button onClick={handleStopCaptureClick}>Stop Capture</button>)
        : (<button onClick={handleStartCaptureClick}>Start Capture</button>)}
      {recordedChunks.length > 0 && (<button onClick={handleDownload}>Download</button>)}
      <video playsInline loop controls src={al}/>

    </div>
  );
};

export default Chat;
