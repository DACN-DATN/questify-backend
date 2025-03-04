Backend of Questify

1. create secret key for a service:
   kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf

2. add custom alias for local dev
   127.0.0.1 questify.dev

- path
  -- mac: /etc/hosts
  -- win: C:\Windows\System32\drivers\etc
