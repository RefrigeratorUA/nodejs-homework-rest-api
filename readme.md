# NodeJS 23. REST API для работы с коллекцией контактов

## 1. Логика аутентификации/авторизации пользователя с помощью [JWT](https://jwt.io/).

### 1.1 Регистрация

Происходит на эндпоинте [`/users/signup`](#registration-request)

- При ошибке валидации возвращает [Ошибку валидации](#registration-validation-error).

- Если почта уже используется кем-то другим, то возвращает
  [Ошибку Conflict](#registration-conflict-error).

- При успешной регистрации получаем [Успешный ответ](#registration-success-response).

#### Registration request

```shell
POST /users/signup
Content-Type: application/json
RequestBody: {
  "email": "example@example.com", //Обязательное поле
  "password": "examplepassword", //Обязательное поле. Alphanum, min 3 chars
  "name": "Test", //Необязательное поле. По-умолчанию "NONAME"
  "subscription": "pro" //Необязательное поле. Может быть только "starter", "pro" или "business"
}
```

#### Registration validation error

```shell
{
    "status": "error",
    "code": 400,
    "message": "Field: password is required", //Не задали пароль при регистрации
    "data": "Bad Request"
}
```

#### Registration conflict error

```shell
{
    "status": "error",
    "code": 409,
    "message": "This email is already use", //Такой email уже используется
    "data": "Conflict"
}
```

#### Registration success response

```shell
{
    "status": "success",
    "code": 201,
    "data": {
        "id": "608ab2c80adb371740515924",
        "email": "example@example.com",
        "subscription": "pro"
    }
}
```

### 1.2 Логин

Происходит на эндпоинте [`/users/login`](#login-request)

- При ошибке валидации возвращает [Ошибку валидации](#login-validation-error).

- Если пароль или email неверный, возвращает [Ошибку Unauthorized](#login-auth-error).

- При успешной авторизации получаем [Успешный ответ](#login-success-response).

#### Login request

```shell
POST /users/login
Content-Type: application/json
RequestBody: {
  "email": "example@example.com",
  "password": "examplepassword"
}
```

#### Login validation error

```shell
{
    "status": "error",
    "code": 400,
    "message": "Field: password length must be at least 3 characters long", //пароль меньше 3-х символов
    "data": "Bad Request"
}
```

#### Login auth error

```shell
{
    "status": "error",
    "code": 401,
    "message": "Invalid credentials" //Неверный или логин или пароль
}
```

#### Login success response

```shell
{
    "status": "success",
    "code": 200,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOGFiMzVkN2FlZWIwMjIyY2UwMjU2OSIsImlhdCI6MTYxOTcwNTM1OSwiZXhwIjoxNjE5NzI2OTU5fQ.kn7e1Ly7aMOPijFE80PhdGuFGJS5jOBxWVpm7un4_4Y"
    }
}
```

### 1.3 Логаут

Происходит на эндпоинте [`/users/logout`](#logout-request)

- Если пользователь не залогинен, выдаем [Ошибку Forbidden](#logout-forbidden-error).

- При успешном выходе, удаляем токен и получаем [Успешный ответ](#logout-success-response).

#### Logout request

```shell
POST /users/logout
Authorization: "Bearer {{token}}"
```

#### Logout forbidden error

```shell
{
    "status": "error",
    "code": 403,
    "message": "Forbidden"
}
```

#### Logout success response

```shell
Status: 204 No Content
```
