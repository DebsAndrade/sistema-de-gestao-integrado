/// <reference types="vite/client" />
import './style.css';
import { renderUsers, loadInitialData } from './ui/RenderUser';
import { renderTasks } from './ui/RenderTask';

function renderApp() {
    
    loadInitialData();
    renderTasks();
    renderUsers();


abstract class Box<T> {
    abstract getItem(): T;
};

class StringBox extends Box<string> {
    getItem(): string {
        return "This is a string";
    }
};

// const myBox: Box<string> = new StringBox();
// console.log(myBox.getItem().toFixed(2));

const myBox2: Box<string> = new StringBox();
console.log(myBox2.getItem().toUpperCase());

class NumberBox extends Box<number> {
    getItem(): number {
        return 42;
    }
};

const myNumberBox: Box<number> = new NumberBox();
console.log(myNumberBox.getItem().toFixed(2));

// const myNumberBox2: Box<number> = new NumberBox();
// console.log(myNumberBox2.getItem().toUpperCase());

function logItem<T>(item: T): void {
    console.log("Item:", item);
}

logItem<string>("Hello, genérico!");
logItem<number>(12345);

class BoxAny {
    getitem(): any {
        return "This is any";
    }
};

const myAnyBox: BoxAny = new BoxAny();
console.log(myAnyBox.getitem().toFixed(2));
console.log(myAnyBox.getitem().toUpperCase());
    
}

renderApp();
