package main

import (
	"crypto/rand"
	"math/big"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Node struct {
	PeerId *big.Int `json:"peerId" xml:"peerId"`
	Ip string `json:"ip" xml:"ip"`
}

var nodelist = []Node{}

func main() {
	e := echo.New()
	e.GET("/", getHome)
	e.GET("/peers", getPeers)
	e.POST("/new", connectPeer)
	e.Logger.Fatal(e.Start(":1323"))
}

type Resp struct {
	Message string `json:"msg" xml:"msg"`
	PeerId *big.Int `json:"peerId" xml:"peerId"`
}

type PeerListResp struct {
	Message string `json:"msg" xml:"msg"` 
	Data []Node `json:"data" xml:"data"` 
}

type CPResp struct {
	Message string `json:"msg" xml:"msg"` 
}

// Helpers
func generatePeerId() *big.Int {
	p, _ := rand.Prime(rand.Reader, 32)
	return p
}

// Route handlers

// Root: returns generated peerId
func getHome(c echo.Context) error {
	peerId := generatePeerId()
	resp := &Resp {
		Message: "Success", 
		PeerId: peerId,
	}
	temp:= Node {
		PeerId: peerId,
		Ip: "0.0.0.0",
	}
	nodelist = append(nodelist, temp)
	return c.JSON(http.StatusOK, resp)
}

// getPeerList - returns online Peer List
func getPeers(c echo.Context) error {
	resp := &PeerListResp {
		Message: "Peer List",
		Data: nodelist,
	}
	return c.JSON(http.StatusOK, resp)
}

// Connect to peer node
func connectPeer(c echo.Context) error {
	resp := &CPResp {
		Message: "Success",  
	}
	return c.JSON(http.StatusOK, resp)
}