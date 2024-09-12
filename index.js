const { select } = require("@inquirer/prompts");

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
        console.log("Let's add a goal!");
        break;
      case "list":
        console.log("Listed goals");
        break;
      case "exit":
        console.log("Bye bye!");
        return;
    }
  }
};

start();
