#!/usr/bin/python3

# This program will connect to a server using websockets to recieve commands.
# The commands will be interpreted to control a Raspberry Pi.
#
# Usage:
#	python3 control.py server name
#
# Server is the address of the server that will send the commands and name is
# the name that will identify this device

import RPi.GPIO as GPIO
import asyncio
import websockets
import json
import sys
from subprocess import call

# Setup
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(18,GPIO.OUT)
GPIO.setup(17,GPIO.OUT)
GPIO.setup(24,GPIO.OUT)
pwm = GPIO.PWM(18, 1000)
pwm.start(0)

async def mainLoop():
	ws = await websockets.connect(
		'ws://' + sys.argv[1])  #10.42.0.1:5000

	await ws.send(sys.argv[2])
	running = True
	while running:
		jsonInput = await ws.recv()
		input = json.loads(jsonInput)

		if input["up"]:
			GPIO.output(24,GPIO.HIGH)
		else:
			GPIO.output(24,GPIO.LOW)

		if input["down"]:
			GPIO.output(17,GPIO.HIGH)
		else:
			GPIO.output(17,GPIO.LOW)

		# Gamepad input
		if len(input["buttons"]): # There is input from a gamepad

			# Stop the program
			if input["buttons"][9]:
				running = False

			# Shutdown the device
			if input["buttons"][12] and input["buttons"][13]:
				call("sudo shutdown -h now", shell=True)

			# Control GPIO
			pwm.ChangeDutyCycle((input["axes"][0] ** 2 + input["axes"][1] ** 2) ** 0.5 * 100)

			if input["buttons"][0]:
				GPIO.output(24,GPIO.HIGH)

			if input["buttons"][1]:
				GPIO.output(17,GPIO.HIGH)



	await ws.close()

asyncio.get_event_loop().run_until_complete(mainLoop())



