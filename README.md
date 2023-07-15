# Wishes [README Work in progress]

Daily reminders for birthdays and anniversaries so that you don't forget wishing your loved ones on time

## The wishing paradox
If you have been part of a typical Indian family, you would know how crucial it is to wish your hundred of relatives on time, otherwise they would say you are not a responsible kid anymore or you are no longer connected to your family

Talking about 2023, when this small project is created. Facebook is very less used by people. Facebook was earlier deemed to be source of truth when people wanted to know whose birthday or anniversary is today. As people are moving towards using less of Facebook and people even removing their birthdays from Facebook, no longer we get last minute reminders to wish someone

## Why this way?
Whatsapp business account free trial helps to send reminders. But as I didn't have any extra phone number to use, I wanted to try something that is free and even doesn't require a credit card

## Project Setup
The project is build over Deno. It is written in form of Edge functions and is currently hosted in Supabase.
The project utilises a private Twilio sandbox to send whatsapp message to an individual phone number

A scheduler runs daily at 12:30 am IST (you can configure this as per your need in Supabase) and checks if some birthday or anniversary falls on that day

### Why Twilio? And how to setup
Twilio provides a sandbox which is free to use. Sandbox works as a Whatsapp account, where you can register and can send whatsapp messages to linked phone numbers.

### Why Supabase? And how to setup
Supabase is a free tier alternative to Firebase and other BaaS. Supabase is great if you want to have a SQL database and over which you can do some functionality and you don't want to host your server separately.



## Start writing code
<TODO>