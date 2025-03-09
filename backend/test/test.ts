type gender = 'M' | 'F';

interface Person {
  gender?: gender;
}
interface Student extends Person {
  name: string;
  age?: number;
  walk(): void;
}

type ClassRoom = {
  students: Student[];
};

const student1: Student = {
  gender: 'M',
  name: 'max',
  walk: function (this): void {
    console.log('waking now', this);
  },
};

type Flex = {
  listing: keyof Student;
};

// class Example implements Student {
//   age = 123;
//   gender = 'F';
//   name = 'sample';
//   walk() {
//     return 'whatever';
//   }
// }

// console.log(student1.walk());

const students: Student[] = [...new Array(20)].map((s, i) => {
  return {
    name: 'sample student',
    age: (i + 1) * 10 + i,
    walk: () => {
      console.log('walking');
    },
  };
});
const classA: ClassRoom = { students };

// console.log(classA);

const flexi: Flex = { listing: 'walk' };

console.log(flexi);

// const ahirwe: Student = { name: 'asmr', walk: () => {} };

type ValueOf<T> = T[keyof T];
type actions = {
  a: {
    type: 'Reset' | 'Test';
    data?: number;
  };
  b: {
    type: 'Reset' | 'Test';
    data?: string;
  };
};
type actionValues = ValueOf<actions>;

const sample: actionValues = { type: 'Test' };

console.log('sample', sample);
