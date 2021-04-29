# NodeJS 23. REST API для работы с коллекцией контактов

<!-- ДЗ № 4 -->

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

<!-- ДЗ № 2-3 -->

## 2. Рауты для работы с коллекцией контактов.

!!! Для работы с коллекцией контактов нужно быть обязательно залогиненным
[`пункт 1.2`](#login-request) !!!

### @ GET /api/contacts

- ничего не получает
- вызывает функцию `listContacts` для работы с json-файлом `contacts.json`
- возвращает массив всех контактов в json-формате со статусом `200`

### @ GET /api/contacts/:contactId

- Не получает `body`
- Получает параметр `contactId`
- вызывает функцию getById для работы с json-файлом contacts.json
- если такой id есть, возвращает обьект контакта в json-формате со статусом `200`
- если такого id нет, возвращает json с ключом `"message": "Not found"` и статусом `404`

### @ POST /api/contacts

- Получает `body` в формате `{name, email, phone}`
- Если в body нет каких-то обязательных полей, возвращает json с ключом
  `{"message": "missing required name field"}` и статусом `400`
- Если с `body` все хорошо, добавляет уникальный идентификатор в объект контакта
- Вызывает функцию `addContact(body)` для сохранения контакта в файле `contacts.json`
- По результату работы функции возвращает объект с добавленным `id` `{id, name, email, phone}` и
  статусом `201`

### @ DELETE /api/contacts/:contactId

- Не получает `body`
- Получает параметр `contactId`
- вызывает функцию `removeContact` для работы с json-файлом `contacts.json`
- если такой `id` есть, возвращает json формата `{"message": "contact deleted"}` и статусом `200`
- если такого `id` нет, возвращает json с ключом `"message": "Not found"` и статусом `404`

### @ PUT /api/contacts/:contactId

- Получает параметр `contactId`
- Получает `body` в json-формате c обновлением любых полей `name, email и phone`
- Если `body` нет, возвращает json с ключом `{"message": "missing fields"}` и статусом `400`
- Если с `body` все хорошо, вызывает функцию `updateContact(contactId, body)` (напиши ее) для
  обновления контакта в файле `contacts.json`
- По результату работы функции возвращает обновленный объект контакта и статусом `200`. В противном
  случае, возвращает json с ключом `"message": "Not found"` и статусом `404`
