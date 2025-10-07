"use client";

import { useState, ChangeEvent } from "react";

//Types ===========================

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: "open" | "resolved";
  numEvents: number;
  numUsers: number;
  value: number;
};

type CheckedState = {
  checked: boolean;
  backgroundColor: string;
};

type TableProps = {
  issues: Issue[];
};

//Component ===========================

const Table = ({ issues }: TableProps) => {
  //Initialize per-issue checkbox state
  // Each issue gets a 'checked' flag and a background color
  const [checkedState, setCheckedState] = useState<CheckedState[]>(
    new Array(issues.length).fill({
      checked: false,
      backgroundColor: "#ffffff",
    })
  );

  //Track "Select All" checkbox and number of selected rows
  const [selectDeselectAllIsChecked, setSelectDeselectAllIsChecked] = useState(false);
  const [numCheckboxesSelected, setNumCheckboxesSelected] = useState(0);

  // Handlers ================================

  /**
   * Handles toggling a single row checkbox.
   * Refactored for clarity — direct, single-responsibility map + reduce.
   */
  const handleOnChange = (index: number): void => {
    const updatedCheckedState = checkedState.map((item, i) =>
      i === index
        ? {
            ...item,
            checked: !item.checked,
            backgroundColor: item.checked ? "#ffffff" : "#eeeeee",
          }
        : item
    );

    setCheckedState(updatedCheckedState);

    //Compute total selected rows in one pass
    const totalSelected = updatedCheckedState.reduce(
      (sum, state, i) => (state.checked ? sum + issues[i].value : sum),
      0
    );

    setNumCheckboxesSelected(totalSelected);
    handleIndeterminateCheckbox(totalSelected);
  };

  /**
   * Updates the indeterminate state of the "Select All" checkbox.
   * Cleaner, avoids nested ifs; uses derived open issue count.
   */
  const handleIndeterminateCheckbox = (total: number): void => {
    const selectAllCheckbox = document.getElementById(
      "custom-checkbox-selectDeselectAll"
    ) as HTMLInputElement | null;
    if (!selectAllCheckbox) return;

    const openIssuesCount = issues.filter((issue) => issue.status === "open").length;

    //Simplified conditional logic for better readability
    if (total === 0) {
      selectAllCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(false);
    } else if (total < openIssuesCount) {
      selectAllCheckbox.indeterminate = true;
      setSelectDeselectAllIsChecked(false);
    } else {
      selectAllCheckbox.indeterminate = false;
      setSelectDeselectAllIsChecked(true);
    }
  };

  /**
   * Handles "Select/Deselect All" toggle.
   * Eliminates duplication by mapping once and reusing computed array.
   */
  const handleSelectDeselectAll = (event: ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.target;

    //Create the appropriate state array in a single expression
    const updatedState: CheckedState[] = issues.map((issue) =>
      checked && issue.status === "open"
        ? { checked: true, backgroundColor: "#eeeeee" }
        : { checked: false, backgroundColor: "#ffffff" }
    );

    setCheckedState(updatedState);

    //Reuse same computation pattern for total
    const totalSelected = updatedState.reduce(
      (sum, state, i) =>
        state.checked && issues[i].status === "open" ? sum + issues[i].value : sum,
      0
    );

    setNumCheckboxesSelected(totalSelected);
    setSelectDeselectAllIsChecked((prev) => !prev);
  };

  // Render ==================================

  return (
    <table className="w-full border-collapse shadow-lg">
      <thead>
        {/* Select All Header Row */}
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6 text-left w-[48px]">
            <input
              id="custom-checkbox-selectDeselectAll"
              name="custom-checkbox-selectDeselectAll"
              type="checkbox"
              className="w-5 h-5 cursor-pointer"
              checked={selectDeselectAllIsChecked}
              onChange={handleSelectDeselectAll}
            />
          </th>
          <th className="py-6 min-w-[8rem] text-left text-black">
            {numCheckboxesSelected
              ? `Selected ${numCheckboxesSelected}`
              : "None selected"}
          </th>
          <th colSpan={2} />
        </tr>

        {/* Column Titles */}
        <tr className="border-2 border-gray-200">
          <th className="py-6 pl-6" />
          <th className="py-6 text-left font-medium text-black">Name</th>
          <th className="py-6 text-left font-medium text-black">Message</th>
          <th className="py-6 text-left font-medium text-black">Status</th>
        </tr>
      </thead>

      <tbody>
        {issues.map(({ name, message, status }, index) => {
          const issueIsOpen = status === "open";
          const isChecked = checkedState[index].checked;

          //Simplified and consistent class concatenation
          const rowClasses = `
            border-b border-gray-200
            ${issueIsOpen ? "cursor-pointer hover:bg-blue-50 text-black" : "text-gray-600 cursor-not-allowed"}
            ${isChecked ? "bg-blue-50" : ""}
          `;

          return (
            <tr
              key={index}
              className={rowClasses}
              onClick={issueIsOpen ? () => handleOnChange(index) : undefined}
            >
              {/* Checkbox Cell */}
              <td className="py-6 pl-6">
                {issueIsOpen ? (
                  <input
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer"
                    checked={isChecked}
                    onChange={() => handleOnChange(index)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    disabled
                    className="w-5 h-5 opacity-50"
                  />
                )}
              </td>

              {/* Data Cells */}
              <td className="py-6">{name}</td>
              <td className="py-6">{message}</td>
              <td className="py-6">
                <div className="flex items-center gap-2">
                  {issueIsOpen ? (
                    <>
                      <span className="inline-block w-[15px] h-[15px] rounded-full bg-blue-600" />
                      <span className="text-blue-700 font-medium">Open</span>
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-[15px] h-[15px] rounded-full bg-gray-400" />
                      <span className="text-gray-700 font-medium">Resolved</span>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
