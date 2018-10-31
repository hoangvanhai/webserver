package main

import (
	"fmt"
	"net"
	"net/http"
	"runtime"
	"time"

	"golang.org/x/net/websocket"
)

func main() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	fmt.Println("application started now is: ", time.Now().Hour(), time.Now().Minute(), time.Now().Second())

	mxHTTP := http.NewServeMux()
	//staticFS := http.FileServer(http.Dir("distribution")); fmt.Println("start static web dis")
    staticFS := http.FileServer(http.Dir("html")); fmt.Println("start static web html")
    //staticFS := http.FileServer(http.Dir("html"));	fmt.Println("start static web html")
	mxHTTP.Handle("/", http.StripPrefix("/", staticFS))
	fmt.Println("start websocket")
	go websocketServe()
	http.ListenAndServe(":8080", mxHTTP)
}

func websocketServe() {
	mxWebsocket := http.NewServeMux()
	mxWebsocket.Handle("/", websocket.Handler(websocketHandle))
	err := http.ListenAndServe(":8081", mxWebsocket)
	if err != nil {
		fmt.Printf("server start failed %v\n", err.Error())
		return
	}
}

func websocketHandle(ws *websocket.Conn) {
	fmt.Printf("[ws] handle %v\n", ws.RemoteAddr().String())
	defer fmt.Printf("[ws] disconnected to %v\n", ws.RemoteAddr().String())
	defer ws.Close()

	wsClientListener(ws)
}

func wsClientListener(ws *websocket.Conn) {
	conn, err := net.Dial("tcp", "127.0.0.1:6025")
	if err != nil {
		fmt.Println("[tcp] connect to server failed", err)
		return
	}
	fmt.Println("[tcp] connected to ", conn.RemoteAddr().String())
	defer fmt.Printf("[tcp] disconnected to %v\n", conn.RemoteAddr().String())
	defer conn.Close()
	go tcpSocketListener(conn, ws)
	rxbuf := make([]byte, 65536)
	for {
		ws.SetReadDeadline(time.Now().Add(time.Millisecond * 100))
		n, err := ws.Read(rxbuf[:65536])
		if err != nil {
			if nerr, ok := err.(*net.OpError); ok {
				if !nerr.Timeout() {
					//fmt.Printf("%v: %v\n", ws.RemoteAddr().String(), err.Error())
					break
				}
			} else {
				break
			}
		}

		if n > 0 {
			fmt.Println("[ws] received client message")
			conn.Write(rxbuf[:n])
		}
	}
	fmt.Println("[ws] exit listener")
}

func tcpSocketListener(conn net.Conn, ws *websocket.Conn) {
	defer conn.Close()
	defer ws.Close()
	rxbuf := make([]byte, 65536)
	for {
		conn.SetReadDeadline(time.Now().Add(time.Millisecond * 100))
		n, err := conn.Read(rxbuf[:65536])
		if err != nil {
			if nerr, ok := err.(*net.OpError); ok {
				if !nerr.Timeout() {
					//fmt.Printf("%v: %v\n", conn.RemoteAddr().String(), err.Error())
					break
				}
			} else {
				break
			}
		}

		if n > 0 {
			sendWsMessage(ws, string(rxbuf[:n]))
			//fmt.Println("[tcp] received: ", string(rxbuf[:n]), "size ", n)
		}
	}
	fmt.Println("[tcp] exit listener")
}

func sendWsMessage(ws *websocket.Conn, data string) {
	websocket.Message.Send(ws, data)
}
