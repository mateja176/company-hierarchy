/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

type Employee = string;
type Hierarchy = { [key in Employee]: Hierarchy };
type Team = [Employee, Employee[]];

const isEmpty = <O>(o: O) => Object.keys(o).length === 0;

const fromEntries = <A extends [string, any][]>(a: A) =>
  a.reduce(
    (o, [key, value]) => ({ ...o, [key]: value }),
    {} as { [key in A[number][0]]: A[number][1] },
  );

const merge = (hierarchy: Hierarchy, newTeam: Team): Hierarchy => {
  const [newManager, newEmployees] = newTeam;

  const newSubHierarchy = fromEntries(
    newEmployees.map<[string, {}]>((employee) => [employee, {}]),
  );

  if (isEmpty(hierarchy)) {
    const newHierarchy = {
      [newManager]: newSubHierarchy,
    };
    return newHierarchy;
  }

  return Object.entries(hierarchy).reduce(
    (mergedHierarchy, [currentManager, currentSubHierarchy]) => {
      const newHierarchy = {
        ...mergedHierarchy,
        [currentManager]:
          currentManager === newManager
            ? newSubHierarchy
            : isEmpty(currentSubHierarchy)
            ? currentSubHierarchy
            : merge(currentSubHierarchy, newTeam),
      };
      return newHierarchy;
    },
    {} as Hierarchy,
  );
};

const printHierarchy = (level: number, hierarchy: Hierarchy): string =>
  Object.entries(hierarchy).reduce(
    (string, [manager, subHierarchy]) =>
      string.concat(
        '    '.repeat(level),
        manager,
        '\n',
        printHierarchy(level + 1, subHierarchy),
      ),
    '',
  );

const sortTeams = (teams: Team[], managers: Employee[]): Team[] =>
  managers.reduce((teamsToSort, manager) => {
    const team = teams.find(([currentManager]) => currentManager === manager);
    return team
      ? teamsToSort.concat([team], sortTeams(teams, team[1]))
      : teamsToSort;
  }, [] as Team[]);

/*
 * Complete the 'Print' function below.
 *
 * The function accepts STRING_ARRAY data as parameter.
 */
function Print1(data: string[]) {
  const teams = data.map<Team>((team) => {
    const [manager, ...employees] = team.split(',');

    return [manager, employees];
  });

  const rootTeam = teams.find(([manager]) =>
    teams.every(([, employees]) => !employees.includes(manager)),
  ) as Team;

  const [, rootEmployees] = rootTeam;

  const sortedTeams = [rootTeam].concat(sortTeams(teams, rootEmployees));

  const hierarchy = sortedTeams.reduce(
    (mergedHierarchy, team) => merge(mergedHierarchy, team),
    {} as Hierarchy,
  );

  return printHierarchy(0, hierarchy);
}

const printRecursively2 = (
  level: number,
  teams: Team[],
  managers: Employee[],
) => {
  managers.forEach((manager) => {
    console.log('    '.repeat(level), manager);
    const team = teams.find(([currentManager]) => currentManager === manager);
    if (team) {
      printRecursively2(level + 1, teams, team[1]);
    }
  });
};

/*
 * Complete the 'Print' function below.
 *
 * The function accepts STRING_ARRAY data as parameter.
 */
function Print2(data: string[]) {
  const teams = data.map<Team>((team) => {
    const [manager, ...employees] = team.split(',');

    return [manager, employees];
  });

  const [rootManager, rootEmployees] = teams.find(([manager]) =>
    teams.every(([, employees]) => !employees.includes(manager)),
  ) as Team;

  console.log(rootManager);

  printRecursively2(1, teams, rootEmployees);

  console.log('\n');
}

/*
 * Complete the 'Print' function below.
 *
 * The function accepts STRING_ARRAY data as parameter.
 */
function Print(data: string[]) {
  const teams = data.map<Team>((team) => {
    const [manager, ...employees] = team.split(',');

    return [manager, employees];
  });

  const employees = data.join(',').split(',');

  const [rootManager] = employees.filter(
    (employee, i, a) => a.indexOf(employee) === i,
  );

  const [, rootEmployees] = teams.find(
    ([manager]) => manager === rootManager,
  ) as Team;

  let hierarchy = '';

  const addBranches = (level: number, managers: Employee[]) => {
    managers.forEach((manager) => {
      hierarchy += '    '.repeat(level);
      hierarchy += manager;
      hierarchy += '\n';
      const team = teams.find(([currentManager]) => currentManager === manager);
      console.log(team);
      if (team) {
        addBranches(level + 1, team[1]);
      }
    });
  };

  hierarchy += rootManager;
  hierarchy += '\n';

  addBranches(1, rootEmployees);

  console.log(hierarchy);
}

console.log(Print(['B2,E5,F6', 'A1,B2,C3,D4', 'D4,G7,I9', 'G7,H8']));
// console.log(Print(['XX,X,XXX', 'XXXX,XXXXX,XXXXXX,XXXXXXX', 'XXXXXX,XX']));
// console.log(Print(['XXXX,XXXXX,XXXXXX,XXXXXXX', 'XXXXXX,XX', 'XX,X,XXX']));
// console.log(
//   Print([
//     '2c59adc1,3d956592,e24a6d81,ae23323d,2a83c9ba',
//     '6e855886,131078ff',
//     '131078ff,93c9f7e9',
//     '3d956592,f16b426f,c08e6dfe,90be1322',
//     '2a83c9ba,eb90e0ce,6e855886',
//   ]),
// );
