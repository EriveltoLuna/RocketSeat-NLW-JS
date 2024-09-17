const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises;

let message = "Welcome to the Goal App";

let goals;

const loadGoals = async () => {
  try {
    const data = await fs.readFile("goals.json", "utf-8");
    goals = JSON.parse(data);
  } catch (error) {
    goals = [];
  }
};

const saveGoals = async () => {
  await fs.writeFile("goals.json", JSON.stringify(goals, null, 2));
};

const addGoal = async () => {
  const goal = await input({ message: "Enter goal:" });

  if (goal.length == 0) {
    message = "The goal cannot be empty!";
    return;
  }

  goals.push({ value: goal, checked: false });
  message = "Goal entry sucessful!";
};

const listedGoals = async () => {
  if (goals.length == 0) {
    message = "No goals selected!";
    return;
  }

  const goalsListed = await checkbox({
    message:
      "Use arrows to navigate, spacebar to check/uncheck and Enter to exit",
    choices: [...goals],
    instructions: false,
  });

  goals.forEach((g) => {
    g.checked = false;
  });

  if (goalsListed.length == 0) {
    message = "No goal selected!";
    return;
  }

  goalsListed.forEach((goalListed) => {
    const goal = goals.find((g) => {
      return g.value == goalListed;
    });

    goal.checked = true;
  });

  message = "Checked goal(s) finished!";
};

const finishedGoals = async () => {
  if (goals.length == 0) {
    message = "No finished goals!";
    return;
  }

  const finished = goals.filter((goal) => {
    return goal.checked;
  });

  if (finished.length == 0) {
    message = "No finished goals!";
    return;
  }

  await select({
    message: `Finished goals: ${finished.length}`,
    choices: [...finished],
  });
};

const openGoals = async () => {
  if (goals.length == 0) {
    message = "No open goals!";
    return;
  }

  const open = goals.filter((goal) => {
    return goal.checked != true;
  });

  if (open.length == 0) {
    message = "No open goals!";
    return;
  }

  await select({
    message: `Open goals: ${open.length}`,
    choices: [...open],
  });
};

const deleteGoals = async () => {
  if (goals.length == 0) {
    message = "No goals to delete!";
    return;
  }

  const uncheckedGoals = goals.map((goal) => {
    return { value: goal.value, checked: false }; // apaga apenas os goals que não foram concluidos, quero apagar qualquer um
  });

  const goalsToDelete = await checkbox({
    message: "Select goals to delete",
    choices: [...uncheckedGoals], // para apagar qualquer goal, só trocar o array pelo goals[] e apagar da 155 a 157
    instructions: false,
  });

  if (goalsToDelete == 0) {
    message = "No goals to delete!";
    return;
  }

  goalsToDelete.forEach((deletedGoal) => {
    goals = goals.filter((goal) => {
      return goal.value != deletedGoal;
    });
  });

  message = "Goal(s) deleted sucessfully!";
};

const showMessage = () => {
  console.clear();

  if (message != "") {
    console.log(message);
    console.log("");
    message = "";
  }
};

const start = async () => {
  await loadGoals();

  while (true) {
    showMessage();
    await saveGoals();

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
          name: "Finished goals",
          value: "finished",
        },
        {
          name: "Open goals",
          value: "open",
        },
        {
          name: "Delete goals",
          value: "delete",
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
        break;
      case "list":
        await listedGoals();
        break;
      case "finished":
        await finishedGoals();
        break;
      case "open":
        await openGoals();
        break;
      case "delete":
        await deleteGoals();
        break;
      case "exit":
        console.log("Bye bye!");
        return;
    }
  }
};

start();
