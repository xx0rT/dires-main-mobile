import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, GripVertical, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  subtasks: Subtask[];
  expanded?: boolean;
}

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Ranní cvičení s pacienty",
    completed: false,
    expanded: true,
    subtasks: [
      { id: "1-1", title: "Mobilizace páteře", completed: true },
      { id: "1-2", title: "Posilování core svalů", completed: true },
      { id: "1-3", title: "Protahovací cviky", completed: false },
      { id: "1-4", title: "Dechová cvičení", completed: false },
    ],
  },
  {
    id: "2",
    title: "Aktualizovat plány léčby",
    completed: false,
    expanded: false,
    subtasks: [
      { id: "2-1", title: "Pacient Novák - bolesti zad", completed: false },
      { id: "2-2", title: "Pacient Svoboda - koleno", completed: false },
    ],
  },
  {
    id: "3",
    title: "Připravit dokumentaci",
    completed: false,
    expanded: false,
    subtasks: [],
  },
];

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onToggleExpand: (id: string) => void;
  onAddSubtask: (todoId: string, title: string) => void;
}

const SortableTodoItem = ({
  todo,
  onToggle,
  onToggleSubtask,
  onToggleExpand,
  onAddSubtask,
}: SortableTodoItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedSubtasks = todo.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = todo.subtasks.length;
  const progress =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(todo.id, newSubtaskTitle.trim());
      setNewSubtaskTitle("");
      setIsAddingSubtask(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Item
        variant={todo.completed ? "muted" : "default"}
        className={`cursor-pointer items-center border-b transition-opacity ${
          todo.completed ? "opacity-60" : ""
        }`}
        onClick={() => onToggle(todo.id)}
      >
        <ItemMedia>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="text-muted-foreground size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(todo.id);
              }}
            >
              {todo.expanded ? (
                <ChevronDown className="text-muted-foreground size-4" />
              ) : (
                <ChevronRight className="text-muted-foreground size-4" />
              )}
            </Button>
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </ItemMedia>
        <ItemContent>
          <div className="flex items-center gap-2">
            <ItemTitle
              className={
                todo.completed ? "text-muted-foreground line-through" : ""
              }
            >
              {todo.title}
            </ItemTitle>
            {totalSubtasks > 0 && (
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <span className="font-medium">
                  {completedSubtasks}/{totalSubtasks}
                </span>
                <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </ItemContent>
      </Item>
      {todo.expanded && (
        <div className="bg-muted/30 border-b pl-12">
          <div className="flex flex-col">
            {todo.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="hover:bg-muted/50 flex items-center gap-2 border-b px-4 py-2 last:border-b-0"
              >
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => onToggleSubtask(todo.id, subtask.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span
                  className={`flex-1 text-sm ${
                    subtask.completed
                      ? "text-muted-foreground line-through"
                      : ""
                  }`}
                >
                  {subtask.title}
                </span>
              </div>
            ))}
            {isAddingSubtask ? (
              <div className="flex items-center gap-2 px-4 py-2">
                <Input
                  autoFocus
                  placeholder="Název podúkolu"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddSubtask();
                    }
                    if (e.key === "Escape") {
                      setIsAddingSubtask(false);
                      setNewSubtaskTitle("");
                    }
                  }}
                  className="h-8"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSubtask();
                  }}
                >
                  Přidat
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddingSubtask(false);
                    setNewSubtaskTitle("");
                  }}
                >
                  Zrušit
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 px-4 py-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingSubtask(true);
                }}
              >
                <Plus className="size-4" />
                Přidat podúkol
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const PhysioTodoList = () => {
  const [todos, setTodos] = useState(initialTodos);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: todo.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st,
              ),
            }
          : todo,
      ),
    );
  };

  const toggleExpand = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, expanded: !todo.expanded } : todo,
      ),
    );
  };

  const addSubtask = (todoId: string, title: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: [
                ...todo.subtasks,
                { id: `${todoId}-${Date.now()}`, title, completed: false },
              ],
              expanded: true,
            }
          : todo,
      ),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = todos.find((t) => t.id === active.id);
    setActiveTodo(todo || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((item) => item.id === active.id);
      const newIndex = todos.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setTodos((items) => arrayMove(items, oldIndex, newIndex));
      }
    }

    setActiveTodo(null);
  };

  const allTodoIds = useMemo(() => todos.map((t) => t.id), [todos]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Úkoly fyzioterapeuta</h2>
        <p className="text-muted-foreground text-sm">
          Organizujte své denní úkoly a plány léčby. Přetáhněte pro změnu pořadí.
        </p>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={allTodoIds}
          strategy={verticalListSortingStrategy}
        >
          <ItemGroup>
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onToggleSubtask={toggleSubtask}
                onToggleExpand={toggleExpand}
                onAddSubtask={addSubtask}
              />
            ))}
          </ItemGroup>
        </SortableContext>
        <DragOverlay>
          {activeTodo ? (
            <Item
              variant={activeTodo.completed ? "muted" : "default"}
              className="cursor-grabbing items-center border-b opacity-90 shadow-lg"
            >
              <ItemMedia>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-grabbing"
                  >
                    <GripVertical className="text-muted-foreground size-4" />
                  </Button>
                  <Checkbox checked={activeTodo.completed} />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle
                  className={
                    activeTodo.completed
                      ? "text-muted-foreground line-through"
                      : ""
                  }
                >
                  {activeTodo.title}
                </ItemTitle>
              </ItemContent>
            </Item>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
