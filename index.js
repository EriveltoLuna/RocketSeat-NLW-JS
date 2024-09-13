const { select, input, checkbox } = require("@inquirer/prompts");
let listChanged = false;
let goals = [
  { value: "teste1", checked: false },
  { value: "teste2", checked: false },
  { value: "teste3", checked: false },
];

const addGoal = async () => {
  const goal = await input({
    message: "Enter goal:",
  });

  if (goal.length === 0) {
    console.log("The goal cannot be empty!");
    return;
  }

  goals.push({
    value: goal,
    checked: false,
  });

  return;
};

const listedGoals = async () => {
  const listedGoal = await checkbox({
    message:
      "Use arrows to navigate, spacebar to check/uncheck and Enter to exit",
    choices: [...goals],
    instructions: false,
  });

  goals.forEach((g) => {
    g.checked = false;
  });

  listedGoal.forEach((listedGoal) => {
    const goal = goals.find((g) => {
      if (g.value === listedGoal) {
        listChanged = true;
        return g;
      } else {
        listChanged = false;
      }
    });
    goal.checked = true;
  });

  const checkedGoals = goals.filter((goal) => goal.checked === true);

  if (checkedGoals.length === 0 || !listChanged) {
    return console.log("No goals selected!");
  } else {
    console.log("Checked goal(s) finished!");
  }
};
const start = async () => {
  while (true) {
    const option = await select({
      message: "Menu >",
      choices: [
        {
          name: "Add goal",
          value: "add",
        },
        {
          name: "List goals",
          value: "list",
        },
        {
          name: "Exit",
          value: "exit",
        },
      ],
    });

    switch (option) {
      case "add":
        await addGoal();
        // console.log(goals); teste
        break;

      case "list":
        await listedGoals();
        // console.log(goals); teste
        break;

      case "exit":
        console.log("Bye bye!");
        return;
    }
  }
};

start();
