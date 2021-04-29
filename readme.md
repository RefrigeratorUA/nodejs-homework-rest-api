# NodeJS 23. REST API для работы с коллекцией контактов

## Логика аутентификации/авторизации пользователя с помощью [JWT](https://jwt.io/).

### Регистрация

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

### Логин

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

## Шаг 2

## Шаг 3

### Проверка токена

Создайте мидлвар для проверки токена и добавь его ко всем маршрутам, которые должны быть защищены.

- Мидлвар берет токен из заголовков `Authorization`, проверяет токен на валидность.
- В случае ошибки вернуть [Ошибку Unauthorized](#middleware-unauthorized-error).
- Если валидация прошла успешно, получить из токена `id` пользователя. Найти пользователя в базе
  данных по этому id.
- Если пользователь существует и токен совпадает с тем, что находится в базе, записать его данные в
  `req.user` и вызвать метод`next()`.
- Если пользователя с таким `id` не существует или токены не совпадают, вернуть
  [Ошибку Unauthorized](#middleware-unauthorized-error)

#### Middleware unauthorized error

```shell
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

## Шаг 4

### Логаут

Создайте ендпоинт [`/users/logout`](#logout-request)

Добавьте в маршрут мидлвар проверки токена.

- В модели `User` найти пользователя по `_id`.
- Если пользователя не существует вернуть [Ошибку Unauthorized](#logout-unauthorized-error).
- В противном случае, удалить токен в текущем юзере и вернуть
  [Успешный ответ](#logout-success-response).

#### Logout request

```shell
POST /users/logout
Authorization: "Bearer {{token}}"
```

#### Logout unauthorized error

```shell
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

#### Logout success response

```shell
Status: 204 No Content
```

## Шаг 5

### Текущий пользователь - получить данные юзера по токену

Создайте эндпоинт [`/users/current`](#current-user-request)

Добавьте в маршрут мидлвар проверки токена.

- Если пользователя не существует вернуть [Ошибку Unauthorized](#current-user-unauthorized-error)
- В противном случае вернуть [Успешный ответ](#current-user-success-response)

#### Current user request

```shell
GET /users/current
Authorization: "Bearer {{token}}"
```

#### Current user unauthorized error

```shell
Status: 401 Unauthorized
Content-Type: application/json
ResponseBody: {
  "message": "Not authorized"
}
```

#### Current user success response

```shell
Status: 200 OK
Content-Type: application/json
ResponseBody: {
  "email": "example@example.com",
  "subscription": "starter"
}
```

## Дополнительное задание - необязательное

- Сделать пагинацию с [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2) для
  коллекции контактов (GET /contacts?page=1&limit=20).
- Сделать фильтрацию контактов по полю избранного (GET /contacts?favorite=true)
- Обновление подписки (`subscription`) пользователя через эндпоинт `PATCH` `/users`. Подписка должна
  иметь одно из следующих значений `['starter', 'pro', 'business']`
