create table users(
    id int AUTO_INCREMENT primary key,
    name varchar(60) not null,
    email varchar(100) not null unique,
    password varchar(500) not null,
    address varchar(500),
    role ENUM ('normal_user','admin','store_owner') not null default 'normal_user',
    created_at timestamp default current_timestamp
);

create table stores(
    id int auto_increment primary key,
    name varchar(100) not null unique,
    email varchar(100) not null unique,
    address varchar(500),
    owner_id int,
    foreign key(owner_id) references users(id) on delete set null,
    created_at timestamp default current_timestamp
    
);

create table ratings(
    id int auto_increment primary key,
    user_id int,
    foreign key(user_id) references users(id) on delete cascade,
    store_id int,
    foreign key(store_id) references stores(id) on delete cascade,
    rating int not null check(rating between 1 and 5),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp,
    unique key unique_user_store (user_id,store_id)
);